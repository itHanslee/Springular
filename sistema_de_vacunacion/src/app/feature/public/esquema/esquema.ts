import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicFooter } from '../components/public-footer/public-footer';
import { PublicHeader } from '../components/public-header/public-header';

type VacunaItem = {
  nombre: string;
  dosis: string;
  enfermedad: string;
};

type GrupoEdad = {
  id: string;
  titulo: string;
  icono: string;
  vacunas: VacunaItem[];
  nota?: string;
};

@Component({
  selector: 'app-esquema',
  standalone: true,
  imports: [CommonModule, PublicHeader, PublicFooter],
  templateUrl: './esquema.html',
  styleUrls: ['./esquema.css'],
})
export class Esquema {
  searchTerm = signal('');
  activeGroup = signal<string | null>(null);

  grupos: GrupoEdad[] = [
{
  id: 'bebes',
  titulo: 'Bebés (0–18 meses)',
  icono: 'bi-bandaid-fill' , 
    vacunas: [
    { nombre: 'BCG', dosis: 'Única (recién nacido)', enfermedad: 'Meningitis tuberculosa' },
    { nombre: 'Hepatitis B', dosis: 'Primera (recién nacido)', enfermedad: 'Hepatitis B' },

    { nombre: 'Pentavalente (DPT + Hib b + Hep B)', dosis: 'Primera (2 meses)', enfermedad: 'Difteria, tos ferina, tétanos, meningitis por Haemophilus influenzae tipo b y hepatitis B' },
    { nombre: 'Antipolio VIP', dosis: 'Primera (2 meses)', enfermedad: 'Poliomielitis' },
    { nombre: 'Rotavirus', dosis: 'Primera (2 meses)', enfermedad: 'Diarrea causada por rotavirus' },
    { nombre: 'Neumococo', dosis: 'Primera (2 meses)', enfermedad: 'Neumonías, otitis, meningitis y bacteriemias' },

    { nombre: 'Pentavalente (DPT + Hib b + Hep B)', dosis: 'Segunda (4 meses)', enfermedad: 'Difteria, tos ferina, tétanos, meningitis por H. influenzae tipo b y hepatitis B' },
    { nombre: 'Antipolio VIP', dosis: 'Segunda (4 meses)', enfermedad: 'Poliomielitis' },
    { nombre: 'Rotavirus', dosis: 'Segunda (4 meses)', enfermedad: 'Diarrea por rotavirus' },
    { nombre: 'Neumococo', dosis: 'Segunda (4 meses)', enfermedad: 'Neumonías, otitis, meningitis y bacteriemias' },

    { nombre: 'Pentavalente (DPT + Hib b + Hep B)', dosis: 'Tercera (6 meses)', enfermedad: 'Difteria, tos ferina, tétanos, meningitis por H. influenzae tipo b y hepatitis B' },
    { nombre: 'Antipolio VIP', dosis: 'Tercera (6 meses)', enfermedad: 'Poliomielitis' },
    { nombre: 'Influenza estacional', dosis: 'Primera (6 meses)', enfermedad: 'Enfermedades respiratorias por virus de la influenza' },

    { nombre: 'Influenza estacional', dosis: 'Segunda (7 meses)', enfermedad: 'Enfermedades respiratorias por virus de la influenza' },

    { nombre: 'Fiebre amarilla', dosis: 'Única (9 meses)', enfermedad: 'Fiebre amarilla' },

    { nombre: 'Neumococo', dosis: 'Primer refuerzo (12 meses)', enfermedad: 'Neumonías, otitis, meningitis y bacteriemias' },
    { nombre: 'Varicela', dosis: 'Única (12 meses)', enfermedad: 'Varicela' },
    { nombre: 'Triple Viral (SRP)', dosis: 'Primera (12 meses)', enfermedad: 'Sarampión, rubéola y paperas' },
    { nombre: 'Hepatitis A', dosis: 'Única (12 meses)', enfermedad: 'Hepatitis A' },

    { nombre: 'Pentavalente (DPT + Hib b + Hep B)', dosis: '1er refuerzo (18 meses)', enfermedad: 'Difteria, tos ferina, tétanos, meningitis por H. influenzae tipo b y hepatitis B' },
    { nombre: 'Antipolio VIP', dosis: 'Refuerzo (18 meses)', enfermedad: 'Poliomielitis' },
    { nombre: 'Triple Viral (SRP)', dosis: 'Refuerzo (18 meses)', enfermedad: 'Sarampión, rubéola y paperas' },
    { nombre: 'Varicela', dosis: 'Refuerzo (18 meses)', enfermedad: 'Varicela' },
  ],
  
  nota: 'La vacuna contra Hepatitis B debe garantizarse en las primeras 12 horas del recién nacido.',


    },
    {
  id: '5-anos',
  titulo: 'A los 5 años',
  icono: 'bi-backpack-fill'  ,
  vacunas: [
    { nombre: 'DPT', dosis: '2do refuerzo', enfermedad: 'Difteria, tos ferina y tétanos' },
    { nombre: 'Antipolio VIP', dosis: '2do refuerzo', enfermedad: 'Poliomielitis' },
    { nombre: 'Varicela', dosis: 'Refuerzo', enfermedad: 'Varicela' },
  ],
},

    {
      id: '9-17-anos',
      titulo: 'De 9 a 17 años',
     icono: 'bi-mortarboard-fill',
      vacunas: [
        { nombre: 'Virus del Papiloma Humano (VPH)', dosis: 'Única', enfermedad: 'Cáncer causado por VPH' },
      ],
    },
    {
      id: 'mef',
      titulo: 'Mujeres en edad fértil (10–49 años)',
      icono: 'bi-person-hearts' ,
      vacunas: [
        { nombre: 'Toxoide tetánico y diftérico del adulto (Td)', dosis: '5 dosis + refuerzo cada 10 años', enfermedad: 'Difteria, tétanos accidental y tétanos neonatal' },
      ],
      nota: 'Td1: Día 0 — Td2: Al mes — Td3: A los 6 meses de Td2 — Td4: Al año de Td3 — Td5: Al año de Td4 — Refuerzo: cada 10 años.',
    },
    {
      id: 'gestantes',
      titulo: 'Gestantes',
     icono: 'bi-heart-pulse-fill' ,
      vacunas: [
        { nombre: 'Influenza estacional', dosis: 'Única por cada embarazo', enfermedad: 'Enfermedad respiratoria por virus de la influenza' },
        { nombre: 'TdaP (Tétanos, Difteria, Tos ferina acelular)', dosis: 'Única', enfermedad: 'Tétanos neonatal, difteria y tos ferina neonatal' },
      ],
      nota: 'Aplicar entre la semana 26 y preferiblemente antes de la semana 36 de gestación.',
    },
    {
      id: 'adultos-60',
      titulo: 'Adultos de 60 años y más',
      icono: 'bi-person-fill'  ,
      vacunas: [
        { nombre: 'Influenza estacional', dosis: 'Única anual a partir de la semana 14', enfermedad: 'Enfermedad respiratoria por virus de la influenza' },
      ],
    },
{
  id: 'viajeros',
  titulo: 'Viajeros',
  icono: 'bi-airplane-fill',
  vacunas: [
    { nombre: 'Fiebre amarilla', dosis: 'Única', enfermedad: 'Fiebre amarilla en zonas de riesgo' },
    { nombre: 'Influenza estacional', dosis: 'Anual', enfermedad: 'Enfermedades respiratorias por virus de la influenza' },
    { nombre: 'COVID-19', dosis: 'Según lineamiento', enfermedad: 'Complicaciones respiratorias asociadas a COVID-19' },
  ],
},
{
  id: 'talento-salud',
  titulo: 'Talento humano en salud',
  icono: 'bi-hospital-fill' ,
  vacunas: [
    { nombre: 'Hepatitis B', dosis: '3 dosis', enfermedad: 'Hepatitis B por exposición ocupacional' },
    { nombre: 'Influenza estacional', dosis: 'Anual', enfermedad: 'Enfermedades respiratorias por virus de la influenza' },
    { nombre: 'Triple Viral (SRP)', dosis: '2 dosis', enfermedad: 'Sarampión, rubéola y paperas' },
  ],
},

  ];

  notasImportantes = [
    'Se debe garantizar 1 dosis y 1 refuerzo de triple viral hasta los 10 años, 11 meses y 29 días.',
    'La vacuna contra varicela se garantiza a toda la cohorte nacida a partir del 1° de julio de 2014, aunque sobrepasen los 6 años.',
    'La vacuna contra Hepatitis A se garantiza a toda la cohorte nacida a partir del 1° de enero de 2012.',
    'La vacuna contra fiebre amarilla (por emergencia sanitaria) se garantiza a personas de 9 meses a 19 años, 11 meses y 29 días en todo el país; y a partir de los 9 meses (incluyendo mayores de 60 años) si viven o transitan por zonas de alto o muy alto riesgo.',
    'No está indicado reiniciar esquemas de vacunación: siempre se debe revisar y continuar con base en el antecedente.',
    'Se debe asegurar la vacunación sin barreras a la población residente en Colombia sin importar su estatus migratorio.',
  ];

  filteredGroups = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    if (!query) {
      return this.grupos;
    }

    return this.grupos.filter((grupo) =>
      grupo.titulo.toLowerCase().includes(query) ||
      grupo.vacunas.some((v) =>
        v.nombre.toLowerCase().includes(query) ||
        v.enfermedad.toLowerCase().includes(query)
      )
    );
  });

  setActiveGroup(id: string): void {
    this.activeGroup.update((current) => (current === id ? null : id));
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }
}