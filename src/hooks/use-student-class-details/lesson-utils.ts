
export const transformLessons = (classSyllabus: any[]) => {
  return classSyllabus?.map((lesson: any) => ({
    ...lesson,
    materials: lesson.lesson_materials || []
  })) || [];
};

export const createDummyLessons = () => {
  return [
    {
      id: 'dummy-1',
      week_number: 1,
      title: "Introduction and Setup",
      description: "Overview of the subject and setting up the learning environment.",
      session_date: new Date().toISOString().split('T')[0],
      start_time: "18:00:00",
      end_time: "19:30:00",
      status: "upcoming",
      materials: [
        {
          id: 'dummy-mat-1',
          material_name: "Setup Guide.pdf",
          material_type: "pdf",
          material_url: "#",
          display_order: 1,
          file_size: 1024
        },
        {
          id: 'dummy-mat-2',
          material_name: "Introduction Slides.ppt",
          material_type: "presentation",
          material_url: "#",
          display_order: 2,
          file_size: 2048
        }
      ]
    },
    {
      id: 'dummy-2',
      week_number: 2,
      title: "Core Concepts",
      description: "Understanding fundamental concepts and principles.",
      session_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      start_time: "18:00:00",
      end_time: "19:30:00",
      status: "upcoming",
      materials: [
        {
          id: 'dummy-mat-3',
          material_name: "Concepts Cheatsheet.pdf",
          material_type: "pdf",
          material_url: "#",
          display_order: 1,
          file_size: 1536
        }
      ]
    }
  ];
};

export const processLessons = (classSyllabus: any[]) => {
  const lessons = transformLessons(classSyllabus);
  return lessons.length > 0 ? lessons : createDummyLessons();
};
