import React from 'react';
import WoowacourseLogo from '@images/woowacourse_logo.png';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 우아한테크코스 All Rights Reserved.</p>
      <p>
        <img src={WoowacourseLogo} width="180" />
      </p>
    </footer>
  );
}

export default Footer;
