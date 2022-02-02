import { styled } from '../../lib/stitches.config';
import Container from 'components/Container';
import { useFormik } from 'formik';
import useMessage from 'hooks/useMessage';
import useUser from 'hooks/useUser';
import useSinglePost from 'hooks/useSinglePost';
import Button from '../../components/shared/Button';
import { Form, InputField } from '../../components/shared/Form';
import useUsers from 'hooks/useUsers';
import { useEffect, useRef } from 'react';

const Wrapper = styled('div', {
  paddingX: '16px',
});
const Heading3 = styled('h3', {
  color: '$secondary',
  fontSize: '46px',
  lineHeight: '40px',
  fontWeight: '500',
  margin: 0,
});
const Heading5 = styled('h5', {
  color: '$secondary',
  fontSize: '24px',
  lineHeight: '20px',
  fontWeight: '400',
  paddingX: '16px',
  margin: 0,
  marginTop: '32px',
});
const SubHeading = styled('p', {
  color: '$secondary',
  fontSize: '18px',
  lineHeight: '16px',
  fontWeight: '400',
  margin: 0,
  marginTop: '16px',
});

const List = styled('ul', {
  padding: 0,
  margin: 0,
  marginTop: '32px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  paddingY: '4px',
  maxHeight: 'calc(100vh - 390px)',
  overflowY: 'auto',
  scrollBehavior: 'smooth',
});

const ListItem = styled('li', {
  margin: 0,
  padding: '16px 0px',
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
});
const ListItemTextWrapper = styled('div', { paddingX: '24px' });
const PrimaryText = styled('p', {
  margin: '0',
  fontSize: '18px',
  color: '$secondary',
  fontWeight: '500',
});
const SecondaryText = styled('p', {
  marginBottom: '0',
  marginTop: '6px',
  fontSize: '14px',
  color: '$secondary',
  fontWeight: '300',
  opacity: 0.7,
});

export default function Message() {
  const { value } = useSinglePost();
  const { results, create } = useMessage();
  const messagesContainerRef = useRef(null);
  const { sendNotification } = useUsers();
  const { user } = useUser();

  const scrollToBottom = () => {
    messagesContainerRef.current.scrollTo(
      0,
      messagesContainerRef.current.scrollHeight + 2000,
    );
  };

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: { text: '' },
    onSubmit: (values, { resetForm }) => {
      create(values.text);
      sendNotification(value?.subject ?? 'Empty Message', values.text);
      resetForm();
      scrollToBottom();
    },
  });

  useEffect(() => {
    if (messagesContainerRef?.current) {
      scrollToBottom();
    }
  }, [results]);

  return (
    <Container>
      <div>
        <Wrapper>
          <Heading3>{value?.subject}</Heading3>
          <SubHeading>Body: {value?.body}</SubHeading>
        </Wrapper>
        <Heading5>Message</Heading5>
        <List ref={messagesContainerRef}>
          {results.map((item) => (
            <ListItem key={item.id}>
              <ListItemTextWrapper>
                <PrimaryText>{item.text}</PrimaryText>
                <SecondaryText>{`From: ${
                  item.user?.name === user.displayName
                    ? 'You'
                    : item.user?.name || ''
                }`}</SecondaryText>
              </ListItemTextWrapper>
            </ListItem>
          ))}
        </List>
        <Form onSubmit={handleSubmit}>
          <InputField
            placeholder="Message"
            required
            name="text"
            onChange={handleChange}
            value={values.text}
          />
          <Button type="submit">Send</Button>
        </Form>
      </div>
    </Container>
  );
}
