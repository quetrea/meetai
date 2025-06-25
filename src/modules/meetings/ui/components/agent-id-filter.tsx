import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { DEFAULT_PAGE_SIZE } from "@/constants";

export const AgentIdFilter = () => {
  const [filters, setFitlers] = useMeetingsFilters();

  const trpc = useTRPC();

  const [agentSearch, setAgentSearch] = useState("");

  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: DEFAULT_PAGE_SIZE,
      search: agentSearch,
    })
  );

  return (
    <>
      <CommandSelect
        className="h-9"
        placeholder="Agent"
        options={(data?.items ?? []).map((agent) => ({
          id: agent.id,
          value: agent.id,
          children: (
            <div className="flex items-center gap-x-2">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={agent.name}
                className="size-4"
              />
              {agent.name}
            </div>
          ),
        }))}
        onSelect={(value) => setFitlers({ agentId: value })}
        onSearch={setAgentSearch}
        value={filters.agentId ?? ""}
      />
    </>
  );
};
