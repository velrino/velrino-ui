'use client';
import { useState } from 'react';
import { Button } from '../../../components/button/index.js';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '../../../components/dropdown-menu/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';

export function MenuExamples() {
  const { menus: copy } = useDesignSystemCopy();
  const [checked, setChecked] = useState(true);
  const [selection, setSelection] = useState('compact');
  const [performed, setPerformed] = useState(false);
  return (
    <div className="vui-showcase-stack">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{copy.open}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{copy.label}</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setPerformed(true)}>{copy.action}</DropdownMenuItem>
          <DropdownMenuItem disabled>{copy.disabled}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={checked}
            onCheckedChange={(value) => setChecked(value === true)}
          >
            {copy.setting}
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{copy.submenu}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onSelect={() => setPerformed(true)}>{copy.nested}</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>{copy.selection}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={selection} onValueChange={setSelection}>
            <DropdownMenuRadioItem value="compact">{copy.first}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="comfortable">{copy.second}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {performed && (
        <p role="status" className="vui-showcase-feedback">
          {copy.feedback}
        </p>
      )}
    </div>
  );
}
