function [lngammac] = Combinatorial(x,r,q)
%Combinitorial component of Unifac
%Written by Jacob Backhaus
%   This function computes the combinitorial component of the activity
%   coefficients.
%   x - liquid mole fraction of each component
%   r - van der Waals volumes
%   q - group surface areas

%code to allow for 0 for the mole fraction of one component
for i=1:length(x);
    if (x(i)==0);
        x(i)=1E-06;
    end
end

%Computes l, phi, and theta arrays
l=5*(r-q)-(r-1);
phi=(r.*x)/(r.'*x);
theta=(q.*x)/(q.'*x);

lngammac=log(phi./x)+5.*q.*log(theta./phi)+l-(phi./x)*(x.'*l);
end

