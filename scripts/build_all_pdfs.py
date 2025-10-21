#!/usr/bin/env python3
import subprocess

# List of scripts to run (in your desired order)
scripts = [
    "build_api_index_pdf.py",
    "build_accessors_pdf.py",
    "build_iterators_pdf.py",
    "build_properties_pdf.py",
    "build_reformatter_pdf.py",
    "build_mutators_pdf.py",
    "build_algebra_pdf.py",
    "build_transforms_pdf.py",
    "build_p5_functions_pdf.py",
    "build_visual_algorithms_pdf.py",
]

for script in scripts:
    print(f"\n=== Ejecutando {script} ===")
    result = subprocess.run(["python3", script])
    if result.returncode != 0:
        print(f"❌ Error en {script}. Deteniendo ejecución.")
        break
    else:
        print(f"✅ {script} completado correctamente.")
