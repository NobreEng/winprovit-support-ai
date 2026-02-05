
import json

source_path = "c:/Users/pedro/Desktop/Estágio WINPROVIT/winprovit-support-ai/system_prompt_v2.md"
dest_path = "c:/Users/pedro/Desktop/Estágio WINPROVIT/winprovit-support-ai/system_prompt_v2_json.txt"

def main():
    try:
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
        
        # Convert to JSON string (this handles escaping quotes and newlines)
        json_string = json.dumps(full_text)
        
        # Remove the surrounding quotes added by json.dumps to get just the inner content
        # actually, for Power Automate, usually you paste the raw string, 
        # but if it's inside a JSON object definition in the flow "Body" field, 
        # it needs to be escaped.
        # The user's screenshot shows "Invalid parameter for HTTP 1. Error: Enter a valid JSON".
        # This usually means the user pasted the raw text into a field that expects a JSON object 
        # OR into a string property of a JSON object.
        # If the user is pasting into "Body" (which looks like a JSON object structure in the screenshot),
        # then the text needs to be escaped.
        
        # Let's provide the content purely escaped, without the surrounding quotes, 
        # so the user can paste it between the quotes in their JSON.
        inner_content = json_string[1:-1]
        
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(inner_content)
            
        print(f"Created {dest_path}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
