package com.robspecs.livestreaming.service;

import java.util.List;
import java.util.Optional;

import com.robspecs.livestreaming.dto.UserDTO;
import com.robspecs.livestreaming.dto.UserProfileDTO;
import com.robspecs.livestreaming.entities.User;



public interface UserService {
	public List<UserDTO> getAllUsers(User user);

	Optional<User> findByUserName(String userName);

	UserProfileDTO getUserProfile(String username);
}
