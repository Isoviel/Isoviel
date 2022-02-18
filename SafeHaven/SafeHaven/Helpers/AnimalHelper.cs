using SafeHaven.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Reflection;
using System.Web;

namespace SafeHaven.Helpers
{
    public static class AnimalHelper
    {
        public static List<Dictionary<string, object>> Search(Animal animal)
        {
            List<Dictionary<String, Object>> listOfAnimals = new List<Dictionary<string, object>>();

            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["AnimalDB"].ToString()))
            {
                connection.Open();
                PropertyInfo[] properties = typeof(Animal).GetProperties();
                string whereClause = string.Empty;
                List<SqlParameter> parameters = new List<SqlParameter>();
                foreach (PropertyInfo property in properties)
                {
                    object value = property.GetValue(animal);
                    if (value != null && !string.IsNullOrEmpty(value.ToString()))
                    {
                        if (!string.IsNullOrWhiteSpace(whereClause))
                        {
                            whereClause += " and ";
                        }
                        else
                        {
                            whereClause = "Where ";
                        }
                        if (property.Name.ToLower() == "name")
                        {
                            whereClause += $"{property.Name} like @{property.Name}";
                            parameters.Add(new SqlParameter(property.Name, value + "%"));

                        }
                        if (property.Name.ToLower() == "animalidnumber")
                        {
                            whereClause += $"{property.Name} = @{property.Name}";
                            parameters.Add(new SqlParameter(property.Name, value));
                        }
                        if (property.Name.ToLower() == "commonname")
                        {
                            whereClause += $"{property.Name} like @{property.Name}";
                            parameters.Add(new SqlParameter(property.Name, "%" + value + "%"));
                        }
                        if (property.Name.ToLower() == "genus")
                        {
                            whereClause += $"{property.Name} like @{property.Name}";
                            parameters.Add(new SqlParameter(property.Name, value + "%"));
                        }
                        if (property.Name.ToLower() == "species")
                        {
                            whereClause += $"{property.Name} like @{property.Name}";
                            parameters.Add(new SqlParameter(property.Name, value + "%"));

                        }
                    }
                }
                using (SqlCommand command = new SqlCommand($"select * from vw_Animal " + whereClause, connection))
                {
                    foreach (SqlParameter parameter in parameters)
                    {
                        command.Parameters.Add(parameter);

                    }
                    using (SqlDataReader reader = command.ExecuteReader())
                    {

                        while (reader.Read())
                        {
                            listOfAnimals.Add(new Dictionary<string, object>());
                            Dictionary<String, Object> newAnimal = listOfAnimals[listOfAnimals.Count - 1];
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                newAnimal.Add(reader.GetName(i), reader.GetValue(i));
                            }
                        }
                    }
                }
            }

            return listOfAnimals;
        }

        internal static int GetNextAnimalIDNumber()
        {
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["AnimalDB"].ToString()))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("up_GetNextAnimalIDNumber", connection))
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    return Convert.ToInt32(command.ExecuteScalar());
                }
            }
        }

        internal static int? Edit(Animal animal)
        {
            int? Id = 0;
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["AnimalDB"].ToString()))
            {
                connection.Open();
                PropertyInfo[] properties = typeof(Animal).GetProperties();
                if (animal.ID != -1)
                {
                    Id = animal.ID;
                    string whereClause = " Where ID = " + animal.ID;
                    string update = "Update Animal set ";
                    List<SqlParameter> parameters = new List<SqlParameter>();
                    foreach (PropertyInfo property in properties)
                    {
                        object value = property.GetValue(animal);
                        if (value != null && property.Name != "ID")
                        {
                            if (update != "Update Animal set ")
                            {
                                update += ", ";
                            }
                            update += $"{property.Name} = @{property.Name}";
                            parameters.Add(new SqlParameter(property.Name, value));
                        }
                    }
                    using (SqlCommand command = new SqlCommand(update + whereClause, connection))
                    {
                        foreach (SqlParameter parameter in parameters)
                        {
                            command.Parameters.Add(parameter);

                        }
                        command.ExecuteNonQuery();

                    }
                }
                else
                {
                    string insert = "Insert into Animal (AnimalIDNumber, Name, MicrochipNumber, CommonName, Genus, Species, DateAquired, Sex, DateOfBirth, Donor, Ownership, Notes, Deceased, Weight, LastFeed, LastShed, MedicationGiven, MedicalNotes, AnimalDiet, AnimalImage) " +
                        "Values (@AnimalIDNumber, @Name, @MicrochipNumber, @CommonName, @Genus, @Species, @DateAquired, @Sex, @DateOfBirth, @Donor, @Ownership, @Notes, @Deceased, @Weight, @LastFeed, @LastShed, @MedicationGiven, @MedicalNotes, @AnimalDiet, @AnimalImage)";
                    List<SqlParameter> parameters = new List<SqlParameter>();
                    foreach (PropertyInfo property in properties)
                    {
                        object value = property.GetValue(animal);
                        if (value != null && property.Name != "ID")
                        {
                            parameters.Add(new SqlParameter(property.Name, value));
                        }
                    }
                    using (SqlCommand command = new SqlCommand(insert, connection))
                    {
                        foreach (SqlParameter parameter in parameters)
                        {
                            command.Parameters.Add(parameter);

                        }
                        command.ExecuteNonQuery();
                    }
                    string sql = "Select @@IDENTITY as ID";
                    using (SqlCommand command = new SqlCommand(sql, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {

                            while (reader.Read())
                            {
                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    Id = Convert.ToInt32(reader.GetValue(i));
                                }
                            }
                        }


                    }

                }

            }

            return Id;
        }

        public static string GetJSONFromContext(HttpContext context)
        {
            string returnValue = "";

            context.Request.InputStream.Position = 0;
            using (var inputStream = new StreamReader(context.Request.InputStream))
            {
                returnValue = inputStream.ReadToEnd();
            }

            return returnValue;
        }
    }
}
