using Newtonsoft.Json;
using SafeHaven.Helpers;
using SafeHaven.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SafeHaven
{
    /// <summary>
    /// Summary description for Edit
    /// </summary>
    public class Edit : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string json = AnimalHelper.GetJSONFromContext(context);
            Animal animal = JsonConvert.DeserializeObject<Animal>(json);
            context.Response.Write(JsonConvert.SerializeObject(AnimalHelper.Edit(animal)));
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