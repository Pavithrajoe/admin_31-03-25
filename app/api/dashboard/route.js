import prisma from "../../../prisma";
import { Role_auth } from "../../src/middleware/auth_middleware";

export async function GET(req) {
  try {
    const { role } = await Role_auth(req);

    // Allow only numeric roles 1 (admin) and 2 (super admin)
    if (role !== 1 && role !== 2) {
      return new Response(
        JSON.stringify({ success: false, message: "Access denied" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [
      totalBlogs,
      totalProducts,
      topBlogger,
      totalSubscribers,
      activeSubscribers,
      inactiveSubscribers,
      totalUsers,
      latestBlogs,
      latestProducts,
      blogUploadingLevel,
      productUploadingLevel,
      superAdmin,
      totalRoles,
      subscriberTraffic,
      activeUsers,
      inactiveUsers
    ] = await Promise.all([
      // Total Blogs
      prisma.blog.count(),

      // Total Products
      prisma.latest_from_company.count(),

      // User with Most Blogs
      prisma.blog.groupBy({
        by: ["user_id"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      }).then(async (result) => {
        if (result.length > 0) {
          const user = await prisma.users.findUnique({
            where: { id: result[0].user_id },
            select: { username: true },
          });
          return {
            username: user?.username || "Unknown",
            blog_count: result[0]._count.id,
          };
        }
        return null;
      }),

      // Total Subscribers
      prisma.subscriber_management.count(),

      // Active Subscribers
      prisma.subscriber_management.count({
        where: { is_active: true },
      }),

      // Inactive Subscribers
      prisma.subscriber_management.count({
        where: { is_active: false },
      }),

      // Total Users
      prisma.users.count(),

      // Latest 10 Blogs
      prisma.blog.findMany({
        take: 10,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          blog_content: true,
          created_at: true,
          users: { select: { username: true } },
        },
      }),

      // Latest 5 Products
      prisma.latest_from_company.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          content: true,
          
          created_at: true,
        },
      }),

      // Blog Uploading Level (Monthly)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', created_at) AS month,
          COUNT(*) AS count
        FROM blog
        GROUP BY month
        ORDER BY month ASC;
      `,

      // Product Uploading Level (Monthly)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', created_at) AS month,
          COUNT(*) AS count
        FROM latest_from_company
        GROUP BY month
        ORDER BY month ASC;
      `,

      // Super Admin Name
      prisma.users.findFirst({
        where: { role: 2 },
        select: { username: true },
      }),

      // Total Roles
      prisma.roles.count(),

      // Subscriber Traffic (Monthly)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', updated_at) AS month,
          COUNT(*) FILTER (WHERE is_active = true) AS active_subscribers,
          COUNT(*) FILTER (WHERE is_active = false) AS inactive_subscribers
        FROM subscriber_management
        GROUP BY month
        ORDER BY month ASC;
      `,

      // Active Users
      prisma.users.count({
        where: { is_active: true },
      }),

      // Inactive Users
      prisma.users.count({
        where: { is_active: false },
      }),
    ]);

    // Construct Response Data
    const data = {
      totals: {
        blogs: totalBlogs,
        products: totalProducts,
        subscribers: totalSubscribers,
        activeSubscribers,
        inactiveSubscribers,
        users: totalUsers,
      },
      topBlogger,
      latestBlogs,
      latestProducts,
      uploadingLevel: {
        blogs: blogUploadingLevel.map((item) => ({
          month: item.month,
          count: item.count,
        })),
        products: productUploadingLevel.map((item) => ({
          month: item.month,
          count: item.count,
        })),
      },
      superAdmin: superAdmin?.username || "N/A",
      totalRoles,
      subscriberTraffic: subscriberTraffic.map((item) => ({
        month: item.month,
        activeSubscribers: item.active_subscribers,
        inactiveSubscribers: item.inactive_subscribers,
      })),
      activeUsers,
      inactiveUsers,
    };

    return new Response(
        JSON.stringify({
            success: true,
            message: "Dashboard data fetched successfully!",
            data: JSON.parse(
              JSON.stringify(data, (_, value) =>
                typeof value === "bigint" ? value.toString() : value
              )
            ),
          }),
          
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetching dashboard data:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
