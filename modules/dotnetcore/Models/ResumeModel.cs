namespace Resume.Models
{
    public class ResumeModel
    {
        public string Name { get; set; }
        public string Title { get; set; }
        public string GitHub { get; set; }
        public string LinkedIn { get; set; }
        public AboutModel About { get; set; }
        public SkillsModel Skills { get; set; }
        public ExperienceModel Experience { get; set; }
        public EducationModel Education { get; set; }
    }
}
