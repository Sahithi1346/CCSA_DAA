import json
import csv
import urllib.request
import urllib.error
import time

SUPABASE_URL = "https://akasnggfsxumghxzqheg.supabase.co"
SUPABASE_KEY = "sb_publishable_XUxotM0Vr72BuBTkdR80aA_Y82J9Dlo"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def post_batch(endpoint, rows):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    data = json.dumps(rows).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8')
        print(f"Error posting to {endpoint}: {e.code} - {err_msg}")
        return e.code

def upload_students():
    print("Reading students CSV...")
    students = []
    with open("data/telangana_eamcet_students_1000_all_telangana.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            try:
                inter = int(r.get("Inter_Marks", 0)) if r.get("Inter_Marks") else None
            except:
                inter = None
            try:
                marks = int(r.get("EAMCET_Marks", 0)) if r.get("EAMCET_Marks") else None
            except:
                marks = None
            try:
                rank = int(r.get("EAMCET_Rank", 0)) if r.get("EAMCET_Rank") else 0
            except:
                rank = 0

            students.append({
                "student_id": r.get("Student_ID", ""),
                "student_name": r.get("Student_Name", ""),
                "inter_marks": inter,
                "eamcet_marks": marks,
                "eamcet_rank": rank,
                "category": r.get("Category", "OC"),
                "preference_1": r.get("Preference_1", ""),
                "preference_2": r.get("Preference_2", ""),
                "preference_3": r.get("Preference_3", ""),
                "preference_4": r.get("Preference_4", ""),
                "preference_5": r.get("Preference_5", "")
            })

    print(f"Uploading {len(students)} students in batches of 100...")
    batch_size = 100
    for i in range(0, len(students), batch_size):
        chunk = students[i:i + batch_size]
        post_batch("students", chunk)
        print(f"Uploaded students {i + 1} to {min(i + batch_size, len(students))}")
        time.sleep(0.2)

def upload_colleges_and_cutoffs():
    print("Reading cutoffs JSON...")
    with open("data/cutoffs.json", "r", encoding="utf-8") as f:
        rows = json.load(f)

    # 1. Unique Colleges
    colleges_dict = {}
    for r in rows:
        code = r.get("INST CODE")
        if code and code not in colleges_dict:
            colleges_dict[code] = {
                "inst_code": code,
                "institute_name": r.get("INSTITUTE NAME", ""),
                "place": r.get("PLACE", ""),
                "district": r.get("DIST", ""),
                "coed": r.get("COED", ""),
                "institute_type": r.get("TYPE", ""),
                "year_of_estb": r.get("YEAR OF ESTB", ""),
                "affiliated": r.get("AFFILIATED", "")
            }

    colleges = list(colleges_dict.values())
    print(f"Uploading {len(colleges)} unique colleges...")
    for i in range(0, len(colleges), 50):
        chunk = colleges[i:i + 50]
        post_batch("colleges", chunk)
        print(f"Uploaded colleges {i + 1} to {min(i + 50, len(colleges))}")
        time.sleep(0.2)

    # 2. Cutoffs
    print(f"Uploading {len(rows)} cutoffs in batches of 100...")
    def parse_int(v):
        try:
            return int(v) if v and v != "NA" and v != "-" else None
        except:
            return None

    cutoffs = []
    for r in rows:
        cutoffs.append({
            "inst_code": r.get("INST CODE"),
            "branch_code": r.get("BRANCH", ""),
            "branch_name": r.get("BRANCH NAME", ""),
            "tuition_fee": parse_int(r.get("TUITION FEE")),
            "oc_boys": parse_int(r.get("OC BOYS")),
            "oc_girls": parse_int(r.get("OC GIRLS")),
            "bc_a_boys": parse_int(r.get("BC_A BOYS")),
            "bc_a_girls": parse_int(r.get("BC_A GIRLS")),
            "bc_b_boys": parse_int(r.get("BC_B BOYS")),
            "bc_b_girls": parse_int(r.get("BC_B GIRLS")),
            "bc_c_boys": parse_int(r.get("BC_C BOYS")),
            "bc_c_girls": parse_int(r.get("BC_C GIRLS")),
            "bc_d_boys": parse_int(r.get("BC_D BOYS")),
            "bc_d_girls": parse_int(r.get("BC_D GIRLS")),
            "bc_e_boys": parse_int(r.get("BC_E BOYS")),
            "bc_e_girls": parse_int(r.get("BC_E GIRLS")),
            "sc_boys": parse_int(r.get("SC BOYS")),
            "sc_girls": parse_int(r.get("SC GIRLS")),
            "st_boys": parse_int(r.get("ST BOYS")),
            "st_girls": parse_int(r.get("ST GIRLS")),
            "ews_gen": parse_int(r.get("EWS GEN OU")),
            "ews_girls": parse_int(r.get("EWS GIRLS OU"))
        })

    for i in range(0, len(cutoffs), 100):
        chunk = cutoffs[i:i + 100]
        post_batch("cutoffs", chunk)
        print(f"Uploaded cutoffs {i + 1} to {min(i + 100, len(cutoffs))}")
        time.sleep(0.2)

if __name__ == "__main__":
    upload_students()
    upload_colleges_and_cutoffs()
    print("All datasets uploaded to Supabase successfully!")
