
import * as React from 'react';
import clsx from 'clsx';

import {
  TextFieldHelperText,
  TextFieldLabel,
  TextFieldContainer
} from 'components/TextField';
import NumberInput, { Props as NumberInputProps } from 'components/NumberInput';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

interface CustomProps {
  label: string;
  error?: boolean;
  helperText?: JSX.Element | string;
  required?: boolean;
  approxUSD: string;
}

type Ref = HTMLInputElement;
const WrappedTokenField = React.forwardRef<Ref, CustomProps & NumberInputProps>(({
  id,
  label,
  error,
  helperText,
  required,
  approxUSD,
  ...rest
}, ref): JSX.Element => {
  return (
    <div className='space-y-1.5'>
      <TextFieldContainer className='relative'>
        <NumberInput
          ref={ref}
          id={id}
          className={clsx(
            'text-5xl',
            'pr-36',
            {
              [clsx(
                'border-interlayCinnabar',
                'text-interlayCinnabar'
              )]: error
            }
          )}
          {...rest} />
        <TextFieldLabel
          className={clsx(
            'text-2xl',
            'text-gray-400',
            'font-medium',
            'absolute',
            'right-4',
            'top-2'
          )}
          required={required}>
          {label}
        </TextFieldLabel>
        <span
          className={clsx(
            'block',
            'text-xl',
            { 'text-interlayTextSecondaryInLightMode':
              process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            'text-right',
            'absolute',
            'right-4',
            'bottom-2'
          )}>
          {approxUSD}
        </span>
      </TextFieldContainer>
      <TextFieldHelperText
        className={clsx(
          { 'text-interlayCinnabar': error },
          'h-6'
        )}>
        {helperText}
      </TextFieldHelperText>
    </div>
  );
});
WrappedTokenField.displayName = 'WrappedTokenField';

export default WrappedTokenField;
