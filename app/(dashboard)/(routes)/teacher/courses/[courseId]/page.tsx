const CourseIdPage = ({
    params
}: {
    params: {courseId: string}
}) => {
    return ( 
        <div>
            Course id {params.courseId} page
        </div>
     );
}
 
export default CourseIdPage;