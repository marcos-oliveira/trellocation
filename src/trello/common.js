// import { useState, useRef } from 'react';
// import { axios, CancelToken } from './trello';

// const initialState = {
//     data: undefined,
//     error: undefined,
//     hasError: undefined,
//     loading: undefined,
// };

// export const useAxiosMutation = (url, method, options = {}) => {
//     const [result, setResult] = useState(initialState);
//     const cancelSourceRef = useRef(null);

//     const onMutationStart = () => {
//         setResult({
//             data: undefined,
//             error: undefined,
//             hasError: false,
//             loading: true,
//         });
//     };

//     const onMutationError = (error) => {
//         setResult({
//             data: undefined,
//             error,
//             hasError: true,
//             loading: false,
//         });
//     };

//     const onMutationCompleted = (response) => {
//         const { data } = response;

//         setResult({
//             data,
//             error: undefined,
//             hasError: false,
//             loading: false,
//         });
//     };

//     const runMutation = (axiosOptions) => {
//         return new Promise(async (resolve, reject) => {
//             onMutationStart();

//             cancelSourceRef.current = CancelToken.source();

//             try {
//                 const response = await axios(url, {
//                     method,
//                     cancelToken: cancelSourceRef.current.token,
//                     ...axiosOptions,
//                 });

//                 onMutationCompleted(response);
//                 resolve(response);
//             } catch (err) {
//                 onMutationError(err);

//                 if (options.rethrow) {
//                     reject(err);
//                 }
//             }
//         });
//     };

//     const cancelMutation = () => {
//         return cancelSourceRef.current
//             ? cancelSourceRef.current.cancel()
//             : undefined;
//     };

//     return [runMutation, result, cancelMutation];
// };
