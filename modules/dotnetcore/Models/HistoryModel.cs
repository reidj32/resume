using System.Collections.Generic;

namespace Resume.Models
{
    public class HistoryModel
    {
        public string Company { get; set; }
        public string Description { get; set; }
        public ContactModel Contact { get; set; }
        public List<PositionModel> Positions { get; set; }
    }
}
