import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useAgentsFilters } from "../../hooks/use-agents-filters";

export const AgentsSearchFilter = () => {
  const [filters, setFilters] = useAgentsFilters();

  return (
    <div className="relative">
      <div className="flex items-center gap-x-2 p-1 overflow-x-auto py-1.5 md:py-0">
        <Input
          placeholder="Filter by name"
          className="h-9 bg-white w-[200px] pl-7"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
        />
        <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
};
