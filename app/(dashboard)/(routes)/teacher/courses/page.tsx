import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { DataTable } from "./_component/data-table";
import { columns } from "./_component/column";

const CoursesPage = async () => {

    const userId = auth();

    if (!userId) {
        return redirect("/");
    }

    // Remove the getToken property from the userId object.
    const { getToken, ...userIdWithoutToken } = userId;

    const courses = await db.course.findMany({
        where: {
            // @ts-ignore
            userId: userIdWithoutToken.userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
    );
};

export default CoursesPage;