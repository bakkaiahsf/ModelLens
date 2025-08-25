Resolving deltas: 100% (2/2), done.
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: 
remote: - GITHUB PUSH PROTECTION
remote:   —————————————————————————————————————————
remote:     Resolve the following violations before pushing again
remote:
remote:     - Push cannot contain secrets
remote:
remote:
remote:      (?) Learn how to resolve a blocked push
remote:      https://docs.github.com/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-from-the-command-line#resolving-a-blocked-push
remote:
remote:
remote:       —— Hugging Face User Access Token ————————————————————
remote:        locations:
remote:          - commit: 6c4bf12410c24f2948794d0253a3b101fa9125a3
remote:            path: dist/assets/index-BNtkU62v.js:54
remote:
remote:        (?) To push, remove secret from commit(s) or follow this URL to allow the secret.
remote:        https://github.com/bakkaiahsf/ModelLens/security/secret-scanning/unblock-secret/31kF0QNJJcVpaaJq7TQHJECCApo
remote:
remote:
remote:
To github.com:bakkaiahsf/ModelLens.git
! [remote rejected] main -> main (push declined due to repository rule violations)
error: failed to push some refs to 'github.com:bakkaiahsf/ModelLens.git'
