import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface ClientOption {
    value: number;
    label: string;
}

interface ClientComboboxProps {
    clients: ClientOption[];
    value: number | null;
    onChange: (value: number | null) => void;
    error?: string;
}

export function ClientCombobox({
    clients,
    value,
    onChange,
    error,
}: ClientComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const selectedClient = clients?.find((client) => client.value === value);

    const filteredClients = React.useMemo(() => {
        if (!clients || clients.length === 0) return [];
        if (!search) return clients;
        
        const searchLower = search.toLowerCase();
        return clients.filter((client) =>
            client.label.toLowerCase().includes(searchLower)
        );
    }, [clients, search]);

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'w-full justify-between',
                        error && 'border-red-500',
                        !value && 'text-muted-foreground',
                    )}
                >
                    {value ? (
                        <span className="truncate">
                            {selectedClient?.label}
                        </span>
                    ) : (
                        'Pilih client (opsional)...'
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                className="w-[var(--radix-popover-trigger-width)] p-0" 
                align="start"
                style={{ zIndex: 9999 }}
            >
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Cari client..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {clients?.length === 0 
                                ? 'Tidak ada data client tersedia.'
                                : 'Client tidak ditemukan.'}
                        </CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value="none"
                                onSelect={() => {
                                    onChange(null);
                                    setOpen(false);
                                    setSearch('');
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onChange(null);
                                    setOpen(false);
                                    setSearch('');
                                }}
                                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        value === null
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                    )}
                                />
                                <span className="text-muted-foreground">
                                    -- Tidak ada client --
                                </span>
                            </CommandItem>
                            {filteredClients.map((client) => (
                                <CommandItem
                                    key={client.value}
                                    value={client.label}
                                    onSelect={() => {
                                        onChange(client.value);
                                        setOpen(false);
                                        setSearch('');
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onChange(client.value);
                                        setOpen(false);
                                        setSearch('');
                                    }}
                                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === client.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {client.label.split(' - ')[0]}
                                        </span>
                                        {client.label.includes(' - ') && (
                                            <span className="text-xs text-muted-foreground">
                                                {client.label.split(' - ')[1]}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
