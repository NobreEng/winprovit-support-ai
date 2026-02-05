
import json
import os

source_path = "c:/Users/pedro/Desktop/Estágio WINPROVIT/winprovit-support-ai/system_prompt_v2.md"
dest_path = "c:/Users/pedro/Desktop/Estágio WINPROVIT/winprovit-support-ai/full_power_automate_body.json"

def main():
    try:
        if not os.path.exists(source_path):
            print(f"Source file not found: {source_path}")
            return

        with open(source_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Extract content between dashed lines
        content = []
        capture = False
        for line in lines:
            if line.strip() == "---":
                if not capture:
                    capture = True
                    continue
                else:
                    break
            if capture:
                content.append(line)
        
        full_text = "".join(content).strip()
        
        # Construct the full JSON object
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": full_text
                        }
                    ]
                }
            ]
        }
        
        # Write to file with ensure_ascii=False to keep accented characters readable
        # but pure JSON compliant (newlines escaped as \n)
        with open(dest_path, 'w', encoding='utf-8') as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
            
        print(f"Created {dest_path}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
