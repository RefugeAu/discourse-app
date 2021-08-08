import { MutationHookOptions } from '@apollo/client';
import { useState } from 'react';

import {
  Upload as UploadType,
  UploadVariables,
} from '../generated/server/Upload';
import { UPLOAD } from '../graphql/server/upload';
import { errorHandlerAlert, formatImageLink } from '../helpers';
import { Image } from '../types';
import { useMutation } from '../utils';

export function useStatelessUpload(
  options?: MutationHookOptions<UploadType, UploadVariables>,
) {
  const [upload, { loading }] = useMutation<UploadType, UploadVariables>(
    UPLOAD,
    {
      ...options,
    },
  );
  return { upload, loading };
}

export function useStatefulUpload(
  imagesArray: Array<Image>,
  currentToken: number,
  options?: MutationHookOptions<UploadType, UploadVariables>,
) {
  const [completedToken, setCompletedToken] = useState(1);
  const [tempArray, setTempArray] = useState<Array<Image>>(imagesArray);
  let newArray = imagesArray;

  let [upload] = useMutation<UploadType, UploadVariables>(UPLOAD, {
    ...options,
    onCompleted: ({ upload: result }) => {
      const {
        originalFilename: name,
        width,
        height,
        shortUrl: url,
        token,
      } = result;
      if (token) {
        const imageUrl = formatImageLink(name, width, height, url);
        newArray[token - 1] = { link: imageUrl, done: true };
        setTempArray(newArray);
        setCompletedToken(token);
      }
    },
    onError: (error) => {
      newArray[currentToken - 2] = { link: '', done: true };
      setTempArray(newArray);
      errorHandlerAlert(error);
    },
  });

  return { upload, tempArray, completedToken };
}
