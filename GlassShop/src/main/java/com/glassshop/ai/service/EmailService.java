package com.glassshop.ai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Send low stock alert to shop admin email
     */
    public void sendLowStockAlert(String toEmail, String message) {

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(toEmail);
        mail.setSubject("⚠ Glass Shop - Low Stock Alert");
        mail.setText(message);

        mailSender.send(mail);
    }
}
