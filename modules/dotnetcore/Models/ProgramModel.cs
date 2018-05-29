namespace Resume.Models
{
    public class ProgramModel
    {
        public string Title { get; set; }
        public ContactModel Contact { get; set; }
        public EntryModel Degree { get; set; }
        public EntryModel Major { get; set; }
        public EntryModel Class { get; set; }
    }
}
