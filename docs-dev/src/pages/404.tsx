import type {  HeadFC } from 'gatsby';

import type { PageProps } from '../page-context';

import React, { useCallback, useMemo } from 'react';

import { navigate } from 'gatsby';

import { StaticImage } from 'gatsby-plugin-image';

import { Button } from 'antd';

import LeftOutlinedIcon from '@ant-design/icons/LeftOutlined';

import Anchor from '../partials/anchor';

import Paragraph from '../partials/paragraph';

const styles : {[x:string]: React.CSSProperties} = {
  heading: { height: 50 },
  image: {
    border: '2px solid #fed',
    height: '16rem',
    width: '16rem'
  },
  imageCredits: {
    display: 'inline-block',
    fontSize: '0.75rem'
  },
  main: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '1rem'
  },
  message: { fontSize: '1.01rem' },
  navBack: { marginTop: '4rem' },
  navBackIcon: { fontWeight: '700' },
  navHomeIcon: { fontWeight: '800' },
  page: {
    display: 'flex',
    flexDirection: 'column'
  }
};

const NotFoundPage : React.FC<PageProps> = ({ className }) => {
  const backIconEl = useMemo(() => ( <LeftOutlinedIcon /> ), []);
  const goBack = useCallback(() => navigate( -1 ), []);
  return (
    
    <article
      className={ `not-found-page ${ className }` }
      style={ styles.page }
    >
        <h1 style={ styles.heading }>Page not found</h1>
        <div style={ styles.main }>
          <Paragraph style={ styles.message }>
            Sorry 😔, we couldn’t find it for you.
          </Paragraph>
          <StaticImage
            alt="basking red fox"
            className="image"
            src="../images/redd-foxx.jpg"
            style={ styles.image }
          />
          <div style={ styles.imageCredits }>
            { 'Photo by ' }
            <Anchor
              to="https://unsplash.com/@terra_gallery?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            >
              TERRA
            </Anchor>
            { ' on ' }
            <Anchor
              to="https://unsplash.com/photos/a-red-fox-sitting-on-top-of-a-snow-covered-slope-W5T76rDUbPs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            >
              Unsplash
            </Anchor>
          </div>
          <Paragraph style={ styles.navBack }>
            <Button
              icon={ backIconEl }
              onClick={ goBack }
              style={ styles.navBackIcon }
              type="primary"
            >
              Return to safety
            </Button>
          </Paragraph>
          <Paragraph>
            <Anchor
              style={ styles.navHomeIcon }
              to="/"
            >
              Go home
            </Anchor>
          </Paragraph>
        </div>
    </article>
  );
};

export default NotFoundPage;

export const Head : HeadFC = () => (
  <title>Not found</title>
);
