package com.robspecs.livestreaming.service;

public interface MailService {

	  public void sendOtpEmail(String email, String otp);
	  void sendPasswordResetEmail(String email, String token);
	  void sendPasswordChangeConfirmationEmail(String toEmail);
}
