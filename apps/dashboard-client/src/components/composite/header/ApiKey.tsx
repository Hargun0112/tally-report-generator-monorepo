import {
  DropdownMenuSeparator,
  DropdownMenuItem,
  Button,
  Input,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from '@trg_package/vite/components';

import { CopyIcon, Trash2Icon } from 'lucide-react';

const ApiKey = () => (
    <div className="w-[300px]">
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Create New API Key</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4 p-2">
                <Input id="name" placeholder="Name" className="col-span-2" />
                <Button type="button" className="col-span-1">
                  Create
                </Button>
              </div>
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>

      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="font-medium">Key 1</span>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="icon">
                <CopyIcon className="h-4 w-4" />
                <span className="sr-only">Copy API Key</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive"
              >
                <Trash2Icon className="h-4 w-4" />
                <span className="sr-only">Delete API Key</span>
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Created 2 days ago
          </div>
        </div>
      </DropdownMenuItem>
    </div>
);

export default ApiKey;
