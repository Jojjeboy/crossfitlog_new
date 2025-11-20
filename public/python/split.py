import json
import os
import math

def split_json_file(input_filename, num_files, output_dir="output_files"):
    """
    Delar upp en stor JSON-fil (som är en lista av objekt) i ett angivet antal mindre filer.

    :param input_filename: Namnet på den stora JSON-filen.
    :param num_files: Antalet utdatafiler som ska skapas (i detta fall 5).
    :param output_dir: Mappen där de nya filerna ska sparas.
    """
    # Skapa utdatamappen om den inte finns
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Läs in hela JSON-datan från filen
    with open(input_filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Kontrollera att datan är en lista (array)
    if not isinstance(data, list):
        print("Fel: JSON-filen måste innehålla en lista (array) på toppnivå för att kunna delas upp på detta sätt.")
        return

    total_items = len(data)
    # Beräkna hur många objekt varje fil ska innehålla (ungefär)
    items_per_file = math.ceil(total_items / num_files)

    print(f"Hittade {total_items} objekt. Delar upp i {num_files} filer med ca {items_per_file} objekt per fil.")

    # Dela upp listan och skriv till separata filer
    for i in range(num_files):
        start_index = i * items_per_file
        end_index = (i + 1) * items_per_file
        # Se till att inte gå utanför listans gränser
        chunk = data[start_index:end_index] 

        output_filename = os.path.join(output_dir, f"output_part_{i+1}.json")
        with open(output_filename, 'w', encoding='utf-8') as outfile:
            json.dump(chunk, outfile, ensure_ascii=False, indent=4)
        
        print(f"Skapade fil: {output_filename} med {len(chunk)} objekt.")

# Användningsexempel:
# Ange namnet på din stora JSON-fil här
input_file = "exercises_test.json" 
# Ange antalet filer du vill dela upp i
number_of_files = 50 

split_json_file(input_file, number_of_files)
