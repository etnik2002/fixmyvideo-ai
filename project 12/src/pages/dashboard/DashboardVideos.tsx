import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient, useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface Video {
  orderId: string;
  packageType: "Standard" | "Premium" | "Enterprise";
  status:
    | "Pending"
    | "Processing"
    | "Completed"
    | "Failed"
    | "Ready for Download";
  createdAt: string;
  imageUrls?: string[];
  outputVideoUrls?: string[];
  title?: string;
  thumbnailUrl?: string;
}

const DashboardVideos: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const {
    data: videosData,
    isLoading,
    error,
  } = useQuery<Video[], Error>({
    queryKey: ["userVideos", user?.uid],
    queryFn: async () => {
      if (!user?.uid) {
        return [];
      }
      const response = await apiClient.get("/api/orders/myorders");
      return response.data.map((order: any) => ({
        orderId: order._id,
        packageType: order.packageType,
        status: order.status,
        createdAt: order.createdAt,
        imageUrls: order.uploadedImageUrls || [],
        outputVideoUrls: order.outputVideoUrls || [],
        title: `Order ${order._id.slice(-4)} - ${order.packageType}`,
        thumbnailUrl: order.outputVideoUrls?.[0] || order.uploadedImageUrls?.[0] || "/placeholder.png",
      }));
    },
    enabled: !!user?.uid,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (error) {
    toast.error(`Failed to fetch videos: ${error.message}`);
  }

  const filteredVideos = useMemo(() => {
    let result = videosData || [];
    if (searchTerm) {
      result = result.filter((video: Video) =>
        video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== "All") {
      result = result.filter((video: Video) => video.status === filterStatus);
    }
    return result;
  }, [videosData, searchTerm, filterStatus]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Videos</h1>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by title or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Ready for Download">Ready for Download</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {isLoading && <p>Loading videos...</p>}

      {error && <p className="text-red-500">Error loading videos.</p>}

      {!isLoading && !error && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video: Video) => (
                <motion.div
                  key={video.orderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800"
                >
                  <img
                    src={video.thumbnailUrl || "/placeholder.png"}
                    alt={video.title || "Video Thumbnail"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 truncate">
                      {video.title || `Order ${video.orderId}`}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Order ID: {video.orderId}
                    </p>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                       Package: {video.packageType}
                    </p>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Created: {format(new Date(video.createdAt), "PPp")}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        video.status === "Completed" || video.status === "Ready for Download"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : video.status === "Processing"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                           : video.status === "Pending"
                           ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {video.status}
                    </span>

                     {(video.status === "Completed" || video.status === "Ready for Download") && video.outputVideoUrls && video.outputVideoUrls.length > 0 && (
                      <div className="mt-4">
                        {video.outputVideoUrls.map((url, index) => (
                           <a
                             key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                             className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm mr-2 mb-2"
                           >
                            Download Video {video.outputVideoUrls && video.outputVideoUrls.length > 1 ? index + 1 : ""}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                No videos found matching your criteria.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default DashboardVideos;