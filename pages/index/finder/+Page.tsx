import React, { useState, useEffect } from "react";
import { Exercise } from "@/types/entities";
import { Filters } from "@/types/navigation";
import { MMAGrooveTitle, SectionType } from "@/lib/generated/prisma/enums";
import onSearchExercisesByFilters from "@/telefunc/exercise.telefunc";
// Importations Shadcn UI
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/organisms/select";
import { Label } from "@/components/ui/label";

export function Page() {
  const [filters, setFilters] = useState<Filters>(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get("search") || undefined,
      groove: (params.get("groove") as MMAGrooveTitle) || undefined,
      key: params.get("key") || undefined,
      bpmMin: params.get("bpmMin") ? Number(params.get("bpmMin")) : undefined,
      bpmMax: params.get("bpmMax") ? Number(params.get("bpmMax")) : undefined,
      sectionTypes: (params.get("sections")?.split(",").filter(Boolean) as SectionType[]) || [],
      chordNotes: params.get("chords")?.split(",").filter(Boolean) || [],
    };
  });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      const res = await onSearchExercisesByFilters(filters);
      if (res.success && res.data) setExercises(res.data);
      setLoading(false);
    };

    // Synchro URL Query Params
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.groove) params.set("groove", filters.groove);
    if (filters.key) params.set("key", filters.key);
    if (filters.bpmMin) params.set("bpmMin", String(filters.bpmMin));
    if (filters.bpmMax) params.set("bpmMax", String(filters.bpmMax));
    if (filters.sectionTypes?.length) params.set("sections", filters.sectionTypes.join(","));
    if (filters.chordNotes?.length) params.set("chords", filters.chordNotes.join(","));

    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    fetchExercises();
  }, [filters]);

  const toggleSectionType = (type: SectionType) => {
    setFilters((prev) => ({
      ...prev,
      sectionTypes: prev.sectionTypes?.includes(type)
        ? prev.sectionTypes.filter((t) => t !== type)
        : [...(prev.sectionTypes || []), type],
    }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-7xl mx-auto min-h-screen bg-background text-foreground">
      {/* PANNEAU DE FILTRES (Sidebar) */}
      <aside className="md:w-120 md:w-80 flex-shrink-0 space-y-6 md:border-r md:pr-6 border-border">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Filtres avancés</h2>
          <p className="text-sm text-muted-foreground">Trouvez rapidement un exercice ciblé</p>
        </div>

        {/* Recherche textuelle */}
        <div className="space-y-2">
          <Label htmlFor="search">Recherche</Label>
          <Input
            id="search"
            placeholder="Titre, compositeur..."
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
          />
        </div>

        {/* Groove (Select Shadcn) */}
        <div className="space-y-2">
          <Label>Groove</Label>
          <Select
            value={filters.groove || "ALL"}
            onValueChange={(value) =>
              setFilters({
                ...filters,
                groove: value === "ALL" ? undefined : (value as MMAGrooveTitle),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les grooves" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les grooves</SelectItem>
              {Object.values(MMAGrooveTitle).map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* BPM Range */}
        <div className="space-y-2">
          <Label>Plage de BPM</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.bpmMin || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  bpmMin: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-1/2"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.bpmMax || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  bpmMax: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-1/2"
            />
          </div>
        </div>

        {/* Sections Multiples (Checkbox Shadcn) */}
        <div className="space-y-2">
          <Label>Doit contenir les sections (Cumulatif) :</Label>
          <div className="rounded-md border border-input p-3 space-y-2 overflow-y-auto bg-card">
            {Object.values(SectionType).map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`section-${type}`}
                  checked={filters.sectionTypes?.includes(type) || false}
                  onCheckedChange={() => toggleSectionType(type)}
                />
                <label
                  htmlFor={`section-${type}`}
                  className="text-sm font-medium leading-none className=cursor-pointer"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ZONE DES RÉSULTATS */}
      <main className="md:w-200 space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Exercices disponibles ({exercises.length})
          </h1>
          {loading && <p className="text-sm text-muted-foreground animate-pulse">Chargement...</p>}
        </div>

        {exercises.length === 0 && !loading ? (
          <div className="text-center py-12 border rounded-lg border-dashed bg-muted/20">
            <p className="text-muted-foreground">
              Aucun exercice ne correspond exactement à vos critères.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((ex) => (
              <a key={ex.id} href={`/game/${ex.id}`}>
                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg truncate">{ex.title}</CardTitle>
                    <CardDescription className="italic truncate">par {ex.composer}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1 text-muted-foreground">
                    <div>
                      <span className="font-semibold text-foreground">Groove :</span>{" "}
                      {ex.defaultConfig?.groove}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Tonalité :</span>{" "}
                      {ex.defaultConfig?.key}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">BPM :</span>{" "}
                      {ex.defaultConfig?.bpm}
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
