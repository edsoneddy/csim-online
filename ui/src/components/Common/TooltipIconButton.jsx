import { Fade } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const TooltipIconButton = ({ props, children, asChild = false, sx = {} }) => {
  const {
    title,
    placement = 'top',
    hiddenTooltip = false,
    onClick = () => {},
    disabled = false,
  } = props || {};

  if (hiddenTooltip) {
    return children;
  }

  return (
    <Tooltip
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
      {asChild ? (
        children
      ) : (
        <IconButton onClick={onClick} sx={sx} disabled={disabled}>
          {children}
        </IconButton>
      )}
    </Tooltip>
  );
};

export default TooltipIconButton;
