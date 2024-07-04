package com.example.demo.config;

import java.security.SecureRandom;

public class PasswordGenerator {
    private static final String DIGITS = "0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateRandomPassword(int length) {
        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = RANDOM.nextInt(DIGITS.length());
            password.append(DIGITS.charAt(index));
        }
        return password.toString();
    }
}
