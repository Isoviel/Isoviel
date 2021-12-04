using Newtonsoft.Json;
using SafeHaven.Helpers;
using SafeHaven.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;

namespace SafeHaven
{
    /// <summary>
    /// Summary description for Search
    /// </summary>
    public class Search : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string command = context.Request.QueryString["command"];
            if (command == "getnextanimalidnumber")
            {
                int nextAnimalIDNumber = AnimalHelper.GetNextAnimalIDNumber();
                context.Response.Write(Json.Encode(nextAnimalIDNumber));
            }
            else
            {
                string json = AnimalHelper.GetJSONFromContext(context);
                Animal animal = JsonConvert.DeserializeObject<Animal>(json);
                context.Response.Write(JsonConvert.SerializeObject(AnimalHelper.Search(animal)));
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}