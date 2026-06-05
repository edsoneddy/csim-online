import { Fade } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const TooltipIconButton = ({ props, children }) => {
  const { title, placement = 'top', hiddenTooltip = false } = props || {};

  if (hiddenTooltip) {
    return children;
  }

  return (
    <Tooltip
      describeChild
      title={title}
      placement={placement}
      arrow
      slots={{
        transition: Fade,
      }}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -5],
              },
            },
          ],
        },
        transition: { timeout: 600 },
      }}
    >
      <IconButton>{children}</IconButton>
    </Tooltip>
  );
};

export default TooltipIconButton;
