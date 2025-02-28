        // Configuration: Array of allowed Visitor IDs with expiry dates and page titles
        const allowedVisitors = [
            {
                visitorID: "677150267b87cc522152ca20712cddfc",
                expiryDate: "2025-12-31T23:59:59", // Expiry date in ISO format
                allowedPageTitle: "Protected Content"
            },
            {
                visitorID: "xyz456visitorId2",
                expiryDate: "2023-11-15T12:00:00", // Expiry date in ISO format
                allowedPageTitle: "Protected Content"
            },
            {
                visitorID: "def789visitorId3",
                expiryDate: "2023-10-20T18:30:00", // Expiry date in ISO format
                allowedPageTitle: "Another Page"
            }
        ];

        // Function to check access
        async function checkAccess() {
            const visitorIdElement = document.getElementById('visitor-id');
            const protectedContent = document.getElementById('protected-content');
            const accessDeniedMessage = document.getElementById('access-denied');
            const copyButton = document.getElementById('copy-button');
            const hideButton = document.getElementById('hide-button');

            // Generate Visitor ID
            const fpPromise = FingerprintJS.load();
            const fp = await fpPromise;
            const result = await fp.get();
            const visitorID = result.visitorId;

            // Display Visitor ID
            visitorIdElement.textContent = visitorID;

            // Find the allowed visitor configuration
            const allowedVisitor = allowedVisitors.find(v => v.visitorID === visitorID);

            if (allowedVisitor) {
                // Check if the page title matches
                if (document.title !== allowedVisitor.allowedPageTitle) {
                    accessDeniedMessage.textContent = "This page is not authorized for your Visitor ID.";
                    return;
                }

                // Check if the access has expired
                const expiryDate = new Date(allowedVisitor.expiryDate);
                const currentTime = new Date();

                if (currentTime <= expiryDate) {
                    // Allow access
                    protectedContent.style.display = 'block';
                    accessDeniedMessage.style.display = 'none';

                    // Hide the Copy Visitor ID button
                    copyButton.style.display = 'none';

                    // Show the "Hide" button
                    hideButton.style.display = 'inline-block';
                } else {
                    // Access expired
                    accessDeniedMessage.textContent = "Your access has expired.";
                }
            } else {
                // Access denied
                accessDeniedMessage.textContent = "You do not have permission to view this content.";
            }
        }

        // Function to copy Visitor ID to clipboard
        function copyVisitorID() {
            const visitorIdElement = document.getElementById('visitor-id');
            const visitorID = visitorIdElement.textContent;

            navigator.clipboard.writeText(visitorID)
                .then(() => {
                    alert('Visitor ID copied to clipboard!');
                })
                .catch((error) => {
                    console.error('Failed to copy Visitor ID:', error);
                });
        }

        // Function to hide the visitor ID portion
        function hideVisitorID() {
            const visitorIdContainer = document.getElementById('visitor-id-container');
            visitorIdContainer.style.display = 'none'; // Hide the visitor ID portion
        }

        // Add event listeners
        document.getElementById('copy-button').addEventListener('click', copyVisitorID);
        document.getElementById('hide-button').addEventListener('click', hideVisitorID);

        // Check access when the page loads
        checkAccess();
