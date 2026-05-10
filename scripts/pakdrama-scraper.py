import requests
import csv
from datetime import datetime, timedelta
import time

def fetch_pakdrama_schedule(days_to_fetch=7):
    base_url = "https://www.pakdrama.pk/api/web-schedule"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json"
    }

    schedule_data = []
    print(f"Starting API fetch for the next {days_to_fetch} days...\n")

    for i in range(days_to_fetch):
        target_date = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d')
        day_name = (datetime.now() + timedelta(days=i)).strftime('%A')
        
        print(f"Fetching data for {day_name}, {target_date}...")
        params = {"date": target_date}
        
        try:
            response = requests.get(base_url, headers=headers, params=params)
            
            if response.status_code == 200:
                json_response = response.json()
                
                for channel in json_response:
                    channel_name = channel.get("name", "Unknown Channel")
                    
                    # Optional: Filter out LTN Family if you still want to!
                    # if channel_name == "LTN Family":
                    #     continue 

                    programs = channel.get("programs", [])
                    
                    for program in programs:
                        title = program.get("title", "Unknown Title")
                        
                        # NEW: Grab the exact ISO timestamps for your UI Math
                        start_time_iso = program.get("start_time_pkt", "")
                        end_time_iso = program.get("end_time_pkt", "")
                        
                        # Keep the friendly string just in case you want to print it
                        friendly_time = program.get("schedule_time", "") 
                        
                        status = program.get("status", "Unknown Status")
                        
                        schedule_data.append([
                            target_date, day_name, channel_name, title, 
                            start_time_iso, end_time_iso, friendly_time, status
                        ])
            else:
                print(f"  -> Error: Server returned status {response.status_code}")
                
        except Exception as e:
            print(f"  -> Connection failed: {e}")
            
        time.sleep(1)

    # Save everything including the new timestamp columns
    filename = "pakdrama_api_schedule_full.csv"
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Date', 'Day', 'Channel', 'Title', 'Start_Time_ISO', 'End_Time_ISO', 'Friendly_Time', 'Status'])
        writer.writerows(schedule_data)
        
    print(f"\nSuccess! Extracted {len(schedule_data)} entries.")

if __name__ == "__main__":
    fetch_pakdrama_schedule(7)
