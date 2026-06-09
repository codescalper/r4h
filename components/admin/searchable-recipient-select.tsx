"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, Megaphone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type RecipientOption = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type Props = {
  members: RecipientOption[];
  value: string; // "__all__" for broadcast, member id for personal
  onChange: (value: string) => void;
};

/**
 * SearchableRecipientSelect
 * A searchable combobox for selecting a message recipient.
 * Shows "Broadcast to all members" as a distinct top option,
 * and the rest of the approved members list is filterable.
 */
export function SearchableRecipientSelect({ members, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selectedMember =
    value !== "__all__" ? members.find((m) => m.id === value) : null;

  const displayLabel =
    value === "__all__"
      ? "Broadcast to all members"
      : selectedMember
        ? `${selectedMember.firstName} ${selectedMember.lastName}`
        : "Select recipient…";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal mt-1"
        >
          <span className="flex items-center gap-2 truncate min-w-0">
            {value === "__all__" ? (
              <Megaphone className="w-3.5 h-3.5 text-primary shrink-0" />
            ) : (
              <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            )}
            <span className="truncate">{displayLabel}</span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search member by name or email…" />
          <CommandList>
            <CommandEmpty>No member found.</CommandEmpty>

            {/* Broadcast option — always on top, separate */}
            <CommandGroup heading="Broadcast">
              <CommandItem
                value="__all__"
                onSelect={() => {
                  onChange("__all__");
                  setOpen(false);
                }}
                className="gap-2"
              >
                <Megaphone className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">
                    Broadcast to all members
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Every approved member receives a personal copy
                  </p>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4 shrink-0",
                    value === "__all__"
                      ? "opacity-100 text-primary"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            {/* Individual members */}
            <CommandGroup heading={`Members (${members.length})`}>
              {members.map((m) => (
                <CommandItem
                  key={m.id}
                  value={`${m.firstName} ${m.lastName} ${m.email}`}
                  onSelect={() => {
                    onChange(m.id);
                    setOpen(false);
                  }}
                  className="gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {m.firstName[0]}
                    {m.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {m.firstName} {m.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {m.email}
                    </p>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 shrink-0",
                      value === m.id ? "opacity-100 text-primary" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
