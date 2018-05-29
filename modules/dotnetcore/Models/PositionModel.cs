using System.Collections.Generic;

namespace Resume.Models
{
    public class PositionModel
    {
        public string Title { get; set; }
        public string Duration { get; set; }
        public List<AccomplishmentModel> Accomplishments { get; set; }
    }
}
