"use client";

import { useState } from "react";

import {
  BotIcon,
  ClockIcon,
  PlusIcon,
  SearchCheckIcon,
  XCircleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { NewMeetingDialog } from "./new-meeting-dialog";

import { AgentIdFilter } from "./agent-id-filter";
import { MeetingsSearchFilter } from "./meetings-search-filter";

import { StatusFilter } from "./status-filter";

import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

import { DEFAULT_PAGE } from "@/constants";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const MeetingsListHeader = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isStatusFilterModified = !!filters.status;
  const isSearchFilterModified = !!filters.search;
  const isAgentFilterModified = !!filters.agentId;

  const activeFilterCount = [
    filters.search ? 1 : 0,
    filters.status ? 1 : 0,
    filters.agentId ? 1 : 0,
  ].reduce((acc, curr) => acc + curr, 0);

  const isAnyFilterModified =
    !!filters.search || !!filters.status || !!filters.agentId;

  const onClearFilters = (option: "all" | "status" | "search" | "agent") => {
    switch (option) {
      case "all":
        setFilters({
          search: "",
          status: null,
          agentId: null,
          page: DEFAULT_PAGE,
        });
        break;
      case "status":
        setFilters((prev) => ({ ...prev, status: null }));
        break;
      case "search":
        setFilters((prev) => ({ ...prev, search: "" }));
        break;
      case "agent":
        setFilters((prev) => ({ ...prev, agentId: null }));
        break;
      default:
        break;
    }
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Meetings</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1  py-1.5 md:py-0">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFilterModified && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} size={"sm"}>
                    Clear Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit">
                  <DropdownMenuGroup>
                    {activeFilterCount > 1 && (
                      <DropdownMenuItem onClick={() => onClearFilters("all")}>
                        <XCircleIcon />
                        Clear All
                      </DropdownMenuItem>
                    )}
                    {isAgentFilterModified && (
                      <DropdownMenuItem onClick={() => onClearFilters("agent")}>
                        <BotIcon />
                        Clear Agent
                      </DropdownMenuItem>
                    )}
                    {isStatusFilterModified && (
                      <DropdownMenuItem
                        onClick={() => onClearFilters("status")}
                      >
                        <ClockIcon />
                        Clear Status
                      </DropdownMenuItem>
                    )}
                    {isSearchFilterModified && (
                      <DropdownMenuItem
                        onClick={() => onClearFilters("search")}
                      >
                        <SearchCheckIcon />
                        Clear Search
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
