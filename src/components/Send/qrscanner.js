import {QrScanner} from '@yudiel/react-qr-scanner';

export function QrReader (props) {
  return (
      <QrScanner
          onDecode={(result) => 
            {
              props.setAddressTo(result)
              props.setShowQrScanner(false)
            }
          }
          onError={(error) => console.log(error?.message)}
      />
  );
}