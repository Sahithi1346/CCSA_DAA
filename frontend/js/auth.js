// auth.js — Supabase authentication and user profile management
// Supports manual email/password signup and login, saving profiles to Supabase profiles/users table,
// with a seamless local storage fallback when Supabase keys are pending.

const Auth = {
  /** Check if Supabase client is connected with valid credentials */
  isSupabaseConfigured() {
    const hasUrl = !!(SUPABASE_URL && !SUPABASE_URL.includes('YOUR_SUPABASE') && SUPABASE_URL.startsWith('https://'));
    const hasKey = !!(SUPABASE_ANON && !SUPABASE_ANON.includes('YOUR_SUPABASE'));
    const clientReady = !!_supabase;
    console.log('[Auth] Supabase configured:', { hasUrl, hasKey, clientReady });
    return hasUrl && hasKey && clientReady;
  },

  /** 
   * Sign up a new user with full name, email, password, and role.
   * Creates auth account in Supabase and inserts profile into 'profiles' table.
   */
  async signUp(fullName, email, password, role = 'student') {
    email = email.trim().toLowerCase();
    console.log('[Auth] signUp attempt for:', email, 'role:', role);

    // 1. Supabase configured flow
    if (this.isSupabaseConfigured()) {
      console.log('[Auth] Using Supabase auth...');
      const { data, error } = await _supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      if (error) {
        console.error('[Auth] Supabase signUp error:', error);
        throw error;
      }
      console.log('[Auth] Supabase signUp success:', data);

      // Insert or update profile row in Supabase table
      try {
        const userId = data?.user?.id;
        if (userId) {
          const { error: profileErr } = await _supabase
            .from('profiles')
            .upsert({
              id: userId,
              email: email,
              full_name: fullName,
              role: role,
              created_at: new Date().toISOString()
            });
          if (profileErr) {
            console.warn("Could not insert to 'profiles' table (check RLS / table name):", profileErr.message);
          }
        }
      } catch (profileCatch) {
        console.warn("Profiles table insert error:", profileCatch);
      }

      // Also mirror locally so instant login works even if email confirm is enabled
      this._saveLocalUser(email, { fullName, email, password, role, id: data?.user?.id || 'sb_' + Date.now() });
      return data;
    }

    // 2. Local fallback storage flow (when Supabase credentials are not yet entered)
    const existing = this._getLocalUser(email);
    if (existing) {
      throw new Error("An account with this email already exists. Please Sign In.");
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      fullName,
      email,
      password, // Stored locally in demo/dev mode
      role,
      createdAt: new Date().toISOString()
    };
    this._saveLocalUser(email, newUser);
    return { user: newUser };
  },

  /** Sign in an existing user with manual credentials */
  async signIn(email, password, remember = true) {
    email = email.trim().toLowerCase();

    // 1. Try Supabase Auth first if configured
    if (this.isSupabaseConfigured()) {
      try {
        const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
        if (error) {
          // If Supabase returns invalid login, check if local user exists
          const localUser = this._getLocalUser(email);
          if (localUser && localUser.password === password) {
            this._setCurrentSession(localUser, remember);
            return { user: localUser };
          }
          throw error;
        }
        
        // Also fetch profile from Supabase profiles table if available
        let profile = null;
        try {
          const { data: profData } = await _supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          profile = profData;
        } catch (_) {}

        const sessionUser = {
          id: data.user.id,
          email: data.user.email,
          fullName: profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0],
          role: profile?.role || data.user.user_metadata?.role || 'student'
        };
        this._setCurrentSession(sessionUser, remember);
        return data;
      } catch (err) {
        // Fallback to local check
        const localUser = this._getLocalUser(email);
        if (localUser && localUser.password === password) {
          this._setCurrentSession(localUser, remember);
          return { user: localUser };
        }
        throw err;
      }
    }

    // 2. Local fallback login
    const user = this._getLocalUser(email);
    if (!user) {
      throw new Error("No account found with this email. Please Sign Up first.");
    }
    if (user.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    this._setCurrentSession(user, remember);
    return { user };
  },

  /** Sign out */
  async signOut() {
    localStorage.removeItem('ccsa_active_user');
    sessionStorage.removeItem('ccsa_active_user');
    if (this.isSupabaseConfigured()) {
      try {
        await _supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase signOut error:", e);
      }
    }
  },

  /** Synchronous helper to get current session from storage */
  getCurrentUser() {
    const localSession = sessionStorage.getItem('ccsa_active_user') || localStorage.getItem('ccsa_active_user');
    if (localSession) {
      try { return JSON.parse(localSession); } catch (_) {}
    }
    return null;
  },

  /** Get the currently logged-in user */
  async getUser() {
    // 1. Check local session
    const localSession = this.getCurrentUser();
    if (localSession) return localSession;

    // 2. Check Supabase session
    if (this.isSupabaseConfigured()) {
      try {
        const { data: { user } } = await _supabase.auth.getUser();
        if (user) {
          return {
            id: user.id,
            email: user.email,
            fullName: user.user_metadata?.full_name || user.email.split('@')[0],
            role: user.user_metadata?.role || 'student'
          };
        }
      } catch (_) {}
    }

    return null;
  },

  /** Auth guard — redirect to login if not authenticated */
  async requireAuth() {
    const user = await this.getUser();
    if (!user) {
      window.location.href = 'login.html';
      return null;
    }
    return user;
  },

  /** Redirect guard — redirect to dashboard if already authenticated */
  async redirectIfLoggedIn() {
    const user = await this.getUser();
    if (user) {
      window.location.href = 'index.html';
    }
    return user;
  },

  // ─── Local Storage Store Helpers ───
  _getUsersRegistry() {
    try {
      return JSON.parse(localStorage.getItem('ccsa_registered_users') || '{}');
    } catch (_) {
      return {};
    }
  },

  _saveLocalUser(email, userData) {
    const users = this._getUsersRegistry();
    users[email] = userData;
    localStorage.setItem('ccsa_registered_users', JSON.stringify(users));
  },

  _getLocalUser(email) {
    const users = this._getUsersRegistry();
    return users[email] || null;
  },

  _setCurrentSession(user, remember = true) {
    const json = JSON.stringify(user);
    if (remember) {
      localStorage.setItem('ccsa_active_user', json);
    } else {
      sessionStorage.setItem('ccsa_active_user', json);
    }
  }
};
