﻿namespace AuthAPI.DTO
{
    public class TokenAPIDTO
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
    }
}
