package com.robspecs.livestreaming.service;

import com.robspecs.livestreaming.dto.RegistrationDTO;
import com.robspecs.livestreaming.dto.ResetPasswordRequest;
import com.robspecs.livestreaming.entities.User;

public interface AuthService {

	User registerNewUser(RegistrationDTO regDTO);

	void processForgotPassword(String email); // <--- ADD THIS METHOD

	void resetPassword(ResetPasswordRequest request); // <--- ADD THIS METHOD
}
