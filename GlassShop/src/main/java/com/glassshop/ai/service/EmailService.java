package com.glassshop.ai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

	@Autowired
    private JavaMailSender mailSender;

    public void sendLowStockAlert(String message) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo("owner@gmail.com");
        mail.setSubject("🚨 LOW STOCK ALERT");
        mail.setText(message);
        mailSender.send(mail);
    }
}
