import json
import os
import glob

def merge_json_files(input_dir="output_files", output_filename="sammanfogad_data.json"):
    """
    Sammanfogar alla JSON-filer i en angiven mapp till en enda stor JSON-fil.
    
    :param input_dir: Mappen där de delade filerna finns.
    :param output_filename: Namnet på den nya, stora JSON-filen.
    """
    merged_data = []
    # Använder glob för att hitta alla filer som slutar på .json i mappen
    # Vi sorterar filnamnen för att säkerställa korrekt ordning (part_1, part_2, etc.)
    file_list = sorted(glob.glob(os.path.join(input_dir, "*.json")))

    if not file_list:
        print(f"Hittade inga JSON-filer i katalogen: {input_dir}")
        return

    print(f"Hittade {len(file_list)} filer att sammanfoga.")

    for file_path in file_list:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if isinstance(data, list):
                    merged_data.extend(data)
                    print(f"Lade till {len(data)} objekt från {os.path.basename(file_path)}")
                else:
                    # Enkel validering: Vi förväntar oss listor i de delade filerna
                    print(f"Varning: Filen {os.path.basename(file_path)} innehöll inte en JSON-lista på toppnivå och hoppades över.")
        except json.JSONDecodeError:
            print(f"Fel vid avkodning av JSON från filen: {os.path.basename(file_path)}. Kontrollera filens format.")
        except Exception as e:
            print(f"Ett oväntat fel inträffade med filen {os.path.basename(file_path)}: {e}")

    # Skriv den sammanfogade datan till en ny fil
    with open(output_filename, 'w', encoding='utf-8') as outfile:
        json.dump(merged_data, outfile, ensure_ascii=False, indent=4)

    print(f"\nFramgångsrikt sammanfogat {len(merged_data)} totalt objekt till {output_filename}")
    
    # Extra valideringssteg: Läs in den nya filen för att säkerställa att den är giltig JSON
    validate_output(output_filename)

def validate_output(filename):
    """Försöker läsa in den nyskapade filen för att validera att den är korrekt JSON."""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"Validering lyckades: {filename} är en giltig JSON-fil.")
    except json.JSONDecodeError as e:
        print(f"Validering misslyckades: {filename} är inte en giltig JSON-fil. Fel: {e}")
    except Exception as e:
        print(f"Ett fel uppstod under validering: {e}")


# Användningsexempel:
# Ange mappen där dina delade filer finns
input_directory = "output_files"
# Ange namnet på den stora filen som ska skapas
output_file = "sammanfogad_original_stor_datafil.json"

merge_json_files(input_directory, output_file)