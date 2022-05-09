import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal, Button, FormGroup, FormControl,
} from 'react-bootstrap';
import { useFormik } from 'formik';
// import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { actions as channelsActions } from '../../slices/channelsSlice.js';
import i18n from '../../i18n.js';
import { getChannelSchema } from '../../yupSchema.js';

const AddChannelModal = (props) => {
  // console.log(props);
  const {
    onHide, socket, setCurrChannelId,
  } = props;

  const channels = useSelector((state) => Object.values(state.channelsReducer.entities));
  const channelNames = channels.map((channel) => channel.name);
  // console.log('channelNames: ', channelNames);

  const [inputValid, setInputValid] = useState(true);
  const [validationError, setValidationError] = useState('');

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const schema = getChannelSchema(channelNames);

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
    },

    onSubmit: (values) => {
      const validate = async (input) => {
        try {
          // const result = await schema.validate(input); // {name: 'test2'}
          // console.log('result: ', result);
          await schema.validate(input);
          socket.emit('newChannel', values, (data) => {
            console.log(data); // confirm if Ok
          });
          socket.on('newChannel', (channel) => {
            setCurrChannelId(channel.id);
            dispatch(channelsActions.addChannel(channel));
          });
          formik.resetForm();
          onHide();
          toast.success('Канал создан', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } catch (err) {
          const [message] = err.errors.map((error) => i18n.t(error.key));
          // console.log('error messages: ', message);
          setInputValid(false);
          setValidationError(message);
        }
      };
      validate(values);
    },
  });

  const { t } = useTranslation('translation', { keyPrefix: 'chat.modals.add' });

  return (
    <Modal
      show
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{t('title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              className={inputValid ? 'mb-2' : 'mb-2 is-invalid'}
              // required
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              name="name"
            />
            {validationError ? <div className="text-danger">{t(validationError)}</div> : null}
          </FormGroup>
          <div className="d-flex justify-content-end">
            <Button className="me-2" variant="secondary" onClick={onHide}>{t('cancelBtn')}</Button>
            <Button type="submit" variant="primary">{t('submitBtn')}</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannelModal;
