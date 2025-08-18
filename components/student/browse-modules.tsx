"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { BookOpen, HelpCircle, Layers, ListChecks, Search } from "lucide-react";
import { fetchData } from "@/lib/api";

type ModuleItem = {
  id: string | number;
  title: string;
  order?: number;
  thumbnail?: string | null;

  // server bisa kirim langsung count
  lessons_count?: number;
  quizzes_count?: number;

  // atau nested contents (fallback)
  contents?: Array<
    | { type: "lesson" | "Lesson"; id: string | number }
    | { type: "quiz" | "Quiz"; id: string | number }
  >;

  // progress dari API (0–100) — jika tidak ada akan dihitung manual di FE
  progress_percent?: number;
  // optional: progress detail
  completed_lessons?: number;
  completed_quizzes?: number;
};

type ApiResponse = {
  success?: boolean;
  status?: boolean;
  data?: ModuleItem[];
  modules?: ModuleItem[];
};

type Props = {
  courseId: string | number;
};

export function StudentBrowseModules({ courseId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ambil q dari URL (?q=)
  useEffect(() => {
    const q = searchParams?.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // coba endpoint umum; sesuaikan jika berbeda
        // contoh yang sering dipakai: /student/courses/{courseId}/modules
        const res: ApiResponse = await fetchData(`/student/courses/${courseId}/modules`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        });

        const list = (res.data ?? res.modules ?? []) as ModuleItem[];

        setModules(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("Failed to fetch modules", e);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId]);

  // helper count kalau API tidak kirim *_count
  const getCounts = (m: ModuleItem) => {
    const lessons =
      typeof m.lessons_count === "number"
        ? m.lessons_count
        : m.contents?.filter((c) => `${c.type}`.toLowerCase() === "lesson").length ?? 0;

    const quizzes =
      typeof m.quizzes_count === "number"
        ? m.quizzes_count
        : m.contents?.filter((c) => `${c.type}`.toLowerCase() === "quiz").length ?? 0;

    return { lessons, quizzes };
  };

  const getProgress = (m: ModuleItem) => {
    if (typeof m.progress_percent === "number") return Math.max(0, Math.min(100, m.progress_percent));

    const { lessons, quizzes } = getCounts(m);
    const total = lessons + quizzes;
    if (!total) return 0;

    const done = (m.completed_lessons ?? 0) + (m.completed_quizzes ?? 0);
    return Math.round((done / total) * 100);
  };

  const filtered = useMemo(() => {
    if (!search) return modules;
    const q = search.toLowerCase();
    return modules.filter((m) => m.title?.toLowerCase().includes(q));
  }, [modules, search]);

  const handleOpenModule = (moduleId: string | number) => {
    // arahkan ke halaman belajar dengan query module
    // sesuaikan path jika kamu sudah punya route khusus
    router.push(`/student/my-learning-course?course=${courseId}&module=${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-midnight-blue-600 to-midnight-blue-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Modules</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Pilih module dari kursus ini untuk mulai belajar
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari module..."
              className="pl-10 h-12 text-base"
            />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="h-12 flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              {filtered.length} / {modules.length} modules
            </Badge>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!loading &&
            filtered.map((m) => {
              const { lessons, quizzes } = getCounts(m);
              const progress = getProgress(m);

              return (
                <Card
                  key={m.id}
                  className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-midnight-blue-200 flex flex-col"
                >
                  {m.thumbnail ? (
                    <img
                      src={m.thumbnail}
                      alt={m.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center rounded-t-lg">
                      <HelpCircle className="w-10 h-10 text-gray-400" />
                    </div>
                  )}

                  <CardHeader className="flex-1">
                    <div className="space-y-2">
                      <Badge variant="outline" className="w-fit">
                        Module {m.order ?? "-"}
                      </Badge>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-midnight-blue-700 transition-colors">
                        {m.title}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{lessons} Lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ListChecks className="w-4 h-4" />
                        <span>{quizzes} Quizzes</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full bg-midnight-blue-800 hover:bg-midnight-blue-900 text-white"
                      onClick={() => handleOpenModule(m.id)}
                    >
                      Open Module
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Module tidak ditemukan</h3>
            <p className="text-gray-500">Coba ubah kata kunci pencarian</p>
          </div>
        )}
      </div>
    </div>
  );
}
