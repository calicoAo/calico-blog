import { Icon } from './icon';
import { memo } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

export const ColorPicker = ({
  color,
  onChange,
  onReset
}: {
  color: string;
  onChange?: (color: string) => void;
  onReset?: () => void;
}) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      <HexColorPicker color={color} onChange={onChange} />
      <div className='flex w-full items-center gap-2'>
        <div
          className={cn(
            'border-input placeholder:text-muted-foreground flex h-8 w-[calc(200px_-_2.5rem)] flex-1 items-center gap-2 overflow-hidden rounded-sm border px-2 py-0.5 outline-none'
          )}
        >
          <span className='text-muted-foreground'>#</span>
          <HexColorInput
            className='border-none outline-none'
            placeholder='请输入颜色'
            color={color}
            onChange={onChange}
          />
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={onReset}
            >
              <Icon name='Undo' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>重置</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export const MemoColorPicker = memo(ColorPicker);
