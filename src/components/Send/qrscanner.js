import {QrScanner} from '@yudiel/react-qr-scanner';

export function QrReader (props) {
  return (
      <QrScanner
          onDecode={(result) => props.setAddressTo(result)}
          onError={(error) => console.log(error?.message)}
      />
  );
}