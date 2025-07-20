import { fetchData } from "@/lib/api";

export const uploadChunk = async (
  file: File,
  chunkSize: number,
  courseId: string,
  moduleId: string,
  onProgress?: (percent: number) => void
) => {
  const totalChunks = Math.ceil(file.size / chunkSize);
  const fileId = crypto.randomUUID();

  for (let i = 0; i < totalChunks; i++) {
    const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
    const formData = new FormData();
    formData.append("file_id", fileId);
    formData.append("chunk_file", chunk);
    formData.append("chunk_index", `${i + 1}`);
    formData.append("course_id", courseId);
    formData.append("module_id", moduleId);

    await fetchData("/chunk/upload", {
      method: "POST",
      body: formData,
    });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalChunks) * 100));
    }
  }

  const mergeForm = new FormData();
  mergeForm.append("file_id", fileId);
  mergeForm.append("total_chunks", `${totalChunks}`);
  mergeForm.append("course_id", courseId);
  mergeForm.append("module_id", moduleId);
  mergeForm.append("file_extension", file.name.split(".").pop() || "mp4");

  const result = await fetchData("/chunk/merge", {
    method: "POST",
    body: mergeForm,
  });

  return result.data.path;
};
