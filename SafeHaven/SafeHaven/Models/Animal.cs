using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SafeHaven.Models
{
    public class Animal
    {
        public int? ID { get; set; }
        public string Name { get; set; }
        public int? AnimalIDNumber { get; set; }
        public string MicrochipNumber { get; set; }
        public string CommonName { get; set; }
        public string Genus { get; set; }
        public string Species { get; set; }
        public string DateAquired { get; set; }
        public string Sex { get; set; }
        public string DateOfBirth { get; set; }
        public string Donor { get; set; }
        public string Ownership { get; set; }
        public string Notes { get; set; }
        public bool? Deceased { get; set; }
        public string Weight { get; set; }
        public string LastFeed { get; set; }
        public string LastShed { get; set; }
        public string MedicationGiven { get; set; }
        public string MedicalNotes { get; set; }
        public string DateDeceased { get; set; }
        public string AnimalDiet { get; set; }
        public string AnimalImage { get; set; }
    }
}
